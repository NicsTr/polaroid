
import os
from io import StringIO, BytesIO
from PIL import Image as IMG

from django import forms
from django.core.files.base import ContentFile, BytesIO

from website.models import Gallery, Image


def resize(image, max_len):
    w, h = image.size
    if w < h:
        nh = max_len
        nw = w * (nh / float(h)) 
    else:
        nw = max_len
        nh = h * (nw / float(w)) 
    medium = image.resize((int(nw), int(nh)), IMG.ANTIALIAS)
    buffer = BytesIO()
    medium.save(buffer, 'JPEG')
    return ContentFile(buffer.getvalue())


class UploadForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = [
                    'gl',
                ]
        widgets = {
                    'path': forms.FileInput(),
                    'gl': forms.HiddenInput(),
                }

    def is_valid(self, user, *args, **kwargs):
        valid = super(UploadForm, self).is_valid(*args, **kwargs)
        gal = self.cleaned_data.get("gl")
        if gal.owner != user:
            return False
        else:
            return valid

    def save(self, img, owner):
        gal = self.cleaned_data.get("gl")
        instance = Image(
                        gl=gal,
                        owner=owner,
                    )
        instance.save()

        image = ContentFile(reduce(lambda a, b: a+b, img.chunks(), ""))
        instance.path.save('__', content=image) # , content=resize(image, 2000))
        instance.path.seek(0)
        image = IMG.open(instance.path.file)
        instance.large.save('__', content=resize(image, 2000))
        instance.thumb.save('__', content=resize(image, 1000))

        instance.save()

        return instance
