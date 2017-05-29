from __future__ import unicode_literals

import os 
from PIL import Image as PILImage

from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

from website.random_primary import RandomPrimaryIdModel

class Gallery(RandomPrimaryIdModel):
    # Name of the gallery
    name = models.CharField(max_length=256, blank=True, null=True)
    path = models.CharField(max_length=1024, blank=False, null=False)
    owner = models.ForeignKey(User)
    cover = models.ForeignKey('Image', null=True)

    def save(self, *args, **kwargs):
        super(Gallery, self).save(*args, **kwargs)
        # Create the repo for this gallery
        path = os.path.join(settings.MEDIA_DIR, self.id)
        if not os.path.exists(path):
            os.makedirs(path)
        self.path = path
        super(Gallery, self).save(*args, **kwargs)


class Image(RandomPrimaryIdModel):
    path = models.ImageField(blank=True, null=True)
    thumb = models.ImageField(blank=True, null=True)
    caption = models.CharField(max_length=1024, null=True, blank=True, default="")
    uploaded = models.DateTimeField(auto_now_add=True)
    gl = models.ForeignKey('Gallery', null=True)
    owner = models.ForeignKey(User)

    def crop(self, r):
        for img in [self.path, self.thumb]:
            im = PILImage.open(img)
            cropped = im.copy()
            im.close()
            h, w = cropped.height, cropped.width
            if h < w:
                nh = w / r
                p = int((h - nh) / 2)
                cropped = cropped.crop((0, p, w, h - p))
            cropped.save(str(img), "JPEG")
