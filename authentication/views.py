from django.shortcuts import redirect, render
from django.contrib.auth.models import User
from .forms import UserRegisterForm,UserUpdateForm, ProfileUpdateForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth import logout
import json
import requests
from .models import ContactFormSubmission


def index(request):
    return render(request, "authentication/index.html")

@login_required
def home(request):
    return render(request, "authentication/home.html")


def signup(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, f'Your account has been successfully created!!,You are able to log in now!')
            return redirect('login')
        else:
            print(form.errors)  
    else:
        form = UserRegisterForm()
    return render(request, "authentication/signup.html", {'form': form})


def signout(request):
    logout(request)
    messages.success(request, "Logged out Successfully!")
    return redirect('index')


@login_required
def profile(request):
    ip = requests.get('https://api.ipify.org?format=json')
    ip_data = json.loads(ip.text)
    res = requests.get('http://ip-api.com/json/' + ip_data["ip"])
    location_data_one = res.text
    location_data = json.loads(location_data_one)

    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)

        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, f'Your account has been updated')
            return redirect('profile')

    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm(instance=request.user.profile)

    context = {
        'u_form': u_form,
        'p_form': p_form,
        'data': location_data
    }

    return render(request, 'authentication/profile.html', context)
 
 #contact part of project converting flask to django!!!!!


@login_required
def contact(request):
    if request.method == 'POST':
        fname = request.POST.get('firstname')
        lname = request.POST.get('lastname')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        country = request.POST.get('country')
        subject = request.POST.get('subject')

        note_instance = ContactFormSubmission.objects.create(
            fname=fname,
            lname=lname,
            email=email,
            phone=phone,
            country=country,
            subject=subject
        )
        messages.success(request, f'Thank you for getting in touch! We have received your message and will get back to you as soon as possible. Your inquiry is important to us.')
        return redirect('contact')  # Move the return statement here

    notes = ContactFormSubmission.objects.all()
    return render(request, 'authentication/contact.html', {'notes': notes})


def about(request):
    return render(request, "authentication/about.html")