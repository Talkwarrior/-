import base64
import urllib
import random

from django.core.files.base import ContentFile
from django.shortcuts import render
from django.urls import reverse
from django.http import HttpRequest, HttpResponseRedirect, JsonResponse

from .models import Card

def index(request):
    adj = ['멋진', '훌륭한', '애정어린']
    obj = ['편지', '엽서', '카드']
    placeholdTitle = f"{random.choice(adj)} {random.choice(obj)}#{str(random.randint(1000, 9999))}"
    return render(request, 'cards/edit.html', context={
        'title': placeholdTitle
    })

def viewCard(request: HttpRequest, cardId: str):
    card = Card.objects.get(hashId=cardId)
    cardImgPath = urllib.parse.unquote(card.data.url)

    return render(request, 'cards/view.html', context={
        'title': card.title,
        'card': cardImgPath
    })

def share(request: HttpRequest):
    if request.method != 'POST':
        return HttpResponseRedirect(reverse('index'))

    try:
        title = request.POST['title']
        data = request.POST['file']
        format, imgStr = data.split(';base64,')
        ext = format.split('/')[-1]

        data = ContentFile(base64.b64decode(imgStr), name=f"{title}.{ext}")
        
        card = Card.objects.create(title=title, data=data)

        print(f"HELLO! {card.hashId}")

        card.save()

        return JsonResponse({
            'msg': 'success',
            'card_url':  request.get_host() + reverse('view', kwargs={'cardId': card.hashId})
            }, status=201)
    except Exception as e:
        return JsonResponse({
            'msg': 'error',
            'error': e
            }, status=201)