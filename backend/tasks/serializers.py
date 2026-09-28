from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """
    Full serializer used for list / retrieve / create / update responses.
    All fields are serialized; `id` and `created_at` are read-only.
    """

    class Meta:
        model = Task
        fields = ["id", "title", "description", "completed", "created_at"]
        read_only_fields = ["id", "created_at"]


class TaskCreateSerializer(serializers.ModelSerializer):
    """
    Serializer used when creating a new task.
    Only `title` and `description` are writable; `completed` defaults to False.
    """

    class Meta:
        model = Task
        fields = ["title", "description"]


class TaskUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer used for full updates (PUT).
    Only `title` and `description` can be changed.
    """

    class Meta:
        model = Task
        fields = ["title", "description"]


class TaskToggleSerializer(serializers.ModelSerializer):
    """
    Serializer used for partial updates (PATCH).
    Only the `completed` flag can be toggled.
    """

    class Meta:
        model = Task
        fields = ["completed"]
