from rest_framework import serializers
from .models import TodoList
from accounts.models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username']

class TodoListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TodoList
        fields = ['id', 'title', 'status', 'tasks', 'created_at', 'updated_at', 'user']