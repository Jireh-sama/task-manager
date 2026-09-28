from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Task
from .serializers import (
    TaskCreateSerializer,
    TaskSerializer,
    TaskToggleSerializer,
    TaskUpdateSerializer,
)


class TaskViewSet(viewsets.ViewSet):
    """
    Endpoints
    
    GET    /tasks/          → list
    POST   /tasks/          → create
    GET    /tasks/{id}/     → retrieve
    PUT    /tasks/{id}/     → update   (title & description only)
    PATCH  /tasks/{id}/     → partial_update (toggle completed only)
    DELETE /tasks/{id}/     → destroy
    """

    def list(self, request):
        """Return every task, newest first."""
        queryset = Task.objects.all()
        serializer = TaskSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        """Create a new task from `title` (required) and `description` (optional)."""
        serializer = TaskCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        return Response(
            TaskSerializer(task).data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, pk=None):
        """Return a single task by primary key."""
        task = get_object_or_404(Task, pk=pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        """
        Full update (PUT) — only `title` and `description` are writable.
        The `completed` flag is intentionally excluded here.
        """
        task = get_object_or_404(Task, pk=pk)
        serializer = TaskUpdateSerializer(task, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            TaskSerializer(task).data,
            status=status.HTTP_200_OK,
        )

    def partial_update(self, request, pk=None):
        """
        Partial update (PATCH) — toggles the `completed` status ONLY.
        No other fields are accepted.
        """
        task = get_object_or_404(Task, pk=pk)
        serializer = TaskToggleSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            TaskSerializer(task).data,
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, pk=None):
        """Delete a task by primary key."""
        task = get_object_or_404(Task, pk=pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
