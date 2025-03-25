from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .serializers import RegisterSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

def add_cors_headers(response):
    """Add CORS headers to every response"""
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST, PUT, GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type"
    response["Access-Control-Max-Age"] = "86400"
    return response

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                response = Response(
                    {'message': 'Registration successful', 'user': serializer.data},
                    status=status.HTTP_201_CREATED
                )
                return add_cors_headers(response)
        
        response = Response(
            {'error': 'Registration failed', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
        return add_cors_headers(response)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            response = Response(
                {'error': 'Username and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            return add_cors_headers(response)
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            response = Response(
                {'message': 'Login successful', 'user': {'username': user.username}},
                status=status.HTTP_200_OK
            )
            return add_cors_headers(response)
        
        response = Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
        return add_cors_headers(response)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            response = Response(
                {'message': 'Logout successful'},
                status=status.HTTP_200_OK
            )
        else:
            response = Response(
                {'error': 'Not authenticated'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return add_cors_headers(response)

@method_decorator(csrf_exempt, name='dispatch')
class AuthCheckView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            response = Response(
                {'authenticated': True, 'username': request.user.username},
                status=status.HTTP_200_OK
            )
        else:
            response = Response(
                {'authenticated': False},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return add_cors_headers(response)
