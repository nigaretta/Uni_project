from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from .views import index


urlpatterns = [
   path('', views.index, name="index"),
   path('home/', views.home, name="home"),
   path('signup/', views.signup, name="signup"),
   path('login/', auth_views.LoginView.as_view(template_name='authentication/login.html', redirect_authenticated_user=True), name="login"),
   path('password-reset/', 
        auth_views.PasswordResetView.as_view(template_name='authentication/password_reset.html'),
        name="password_reset"),
   path('password-reset/done/', 
        auth_views.PasswordResetDoneView.as_view(template_name='authentication/password_reset_done.html'),
        name="password_reset_done"),
   path('password-reset-confirm/<uidb64>/<token>/', 
        auth_views.PasswordResetConfirmView.as_view(template_name='authentication/password_reset_confirm.html'),
        name="password_reset_confirm"),
     path('password-reset-complete/', 
        auth_views.PasswordResetCompleteView.as_view(template_name='authentication/password_reset_complete.html'),
        name="password_reset_complete"),
   path('logout/', views.signout, name="logout"),
   path('profile/', views.profile, name="profile"),
   path('about/', views.about, name="about"),
   path('contact/', views.contact, name='contact'),
   
]
