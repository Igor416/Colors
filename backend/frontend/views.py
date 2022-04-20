from django.shortcuts import render

# Create your views here.
def home(request, string='', string1='', string2=''):
    return render(request, 'index.html')
