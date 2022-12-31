from django.db import models
from hashids import Hashids

hashids = Hashids(salt="kuccForever", min_length=10)

class Card(models.Model):
    title = models.CharField(max_length=100)
    data = models.FileField(upload_to='static/saves/')
    hashId = models.CharField(max_length=15)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.hashId = hashids.encode(self.id)