from django.contrib import admin
from . models import Profile
from .models import ContactFormSubmission

admin.site.register(ContactFormSubmission)

# Register your models here.
admin.site.register(Profile)
