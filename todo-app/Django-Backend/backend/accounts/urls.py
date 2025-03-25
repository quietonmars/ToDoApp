from django.urls import path
from .views import RegisterView, LoginView, LogoutView, AuthCheckView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check/', AuthCheckView.as_view(), name='auth-check'),
]