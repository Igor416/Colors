from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField('Name', max_length=50)
    email = models.EmailField('Email', max_length=255, unique=True)
    password = models.CharField('Password', max_length=255)
    colors = models.TextField('Colors', blank=True)

    def __str__(self):
        return f'User: "{self.name}"'

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
