from django.urls import path

from . import views

urlpatterns = [
    path('', view=views.index, name='index'),
    path('view/<str:cardId>', view=views.viewCard, name='view'),
    path('share', view=views.share, name='share')
]