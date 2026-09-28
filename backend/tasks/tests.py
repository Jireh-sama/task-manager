from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Task


class TaskAPITests(APITestCase):
    def setUp(self):
        self.task1 = Task.objects.create(
            title="Task 1",
            description="Description 1",
            completed=False,
        )
        self.task2 = Task.objects.create(
            title="Task 2",
            description="Description 2",
            completed=True,
        )

    def test_list_tasks(self):
        url = reverse("task-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_task(self):
        url = reverse("task-list")
        payload = {"title": "New Task", "description": "New Description"}
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Task")
        self.assertEqual(response.data["description"], "New Description")
        self.assertFalse(response.data["completed"])
        self.assertEqual(Task.objects.count(), 3)

    def test_create_task_validation_error(self):
        url = reverse("task-list")
        response = self.client.post(url, {"description": "No title"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("title", response.data)

    def test_retrieve_task(self):
        url = reverse("task-detail", kwargs={"pk": self.task1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Task 1")

    def test_update_task(self):
        url = reverse("task-detail", kwargs={"pk": self.task1.pk})
        payload = {"title": "Updated Task 1", "description": "Updated Description"}
        response = self.client.put(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task1.refresh_from_db()
        self.assertEqual(self.task1.title, "Updated Task 1")
        self.assertEqual(self.task1.description, "Updated Description")

    def test_toggle_task_completed(self):
        url = reverse("task-detail", kwargs={"pk": self.task1.pk})
        response = self.client.patch(url, {"completed": True}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task1.refresh_from_db()
        self.assertTrue(self.task1.completed)

    def test_delete_task(self):
        url = reverse("task-detail", kwargs={"pk": self.task1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Task.objects.filter(pk=self.task1.pk).exists())
