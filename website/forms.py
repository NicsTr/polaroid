
import os
from PIL import Image as IMG

from django import forms

from website.models import Gallery, Image

class UploadForm(forms.ModelForm):
    class Meta:
        model = Image
        fields = [
                    # 'path', 
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
        new_img = Image(
                        gl=gal,
                        owner=owner,
                    )
        new_img.save()
        new_img.path=os.path.join(gal.path, new_img.id + ".jpg")
        new_img.large=os.path.join(gal.path, new_img.id + "-large.jpg")
        new_img.thumb=os.path.join(gal.path, new_img.id + "-small.jpg")
        new_img.save()
        with open(str(new_img.path), 'wb+') as dest:
            for chunk in img.chunks():
                dest.write(chunk)
        im = IMG.open(str(new_img.path))
        s = im.size
        r = float(s[0]) / s[1]
        with open(str(new_img.thumb), 'wb+') as dest:
            if r < 1:
                im.thumbnail((r*1000, 1000), IMG.ANTIALIAS)
            else:
                im.thumbnail((1000, 1000/r), IMG.ANTIALIAS)
            im.save(dest, "JPEG")
        im = IMG.open(str(new_img.path))
        s = im.size
        r = float(s[0]) / s[1]
        with open(str(new_img.large), 'wb+') as dest:
            if r < 1:
                im.thumbnail((r*2000, 2000), IMG.ANTIALIAS)
            else:
                im.thumbnail((2000, 2000/r), IMG.ANTIALIAS)
            im.save(dest, "JPEG")
        return new_img

