from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.hashers import make_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email']
    
    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            password=make_password(validated_data['password']),
            email=validated_data.get('email', '')
        )
        return user