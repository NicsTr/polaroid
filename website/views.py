
from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required

from website.models import Gallery, Image
from website.forms import UploadForm

def index(request):
    tpl = "polaroid/index.html"
    ctxt = dict()
    if request.user.is_authenticated():
        ctxt["galleries"] = Gallery.objects.all().filter(owner=request.user)
        ctxt["cover"] = list()
    return render(request, tpl, ctxt)

@login_required
def create_gallery(request):
    g = Gallery(owner=request.user)
    g.save()
    return redirect("gallery", g.id)

def cover_gallery(request, gid):
    cover = Gallery.objects.get(id=gid).cover
    if cover is None:
        cover = Gallery.objects.get(id=gid).image_set.first()
    if cover is None:
        return HttpResponse()
    else:
        return HttpResponse(gid + ";" + cover.id)

@login_required
def set_cover_gallery(request, gid, mid):
    gl = Gallery.objects.get(id=gid)
    if gl is None or gl.owner != request.user:
        return HttpResponse("KO")
    img = gl.image_set.get(id=mid)
    if img is None or img.owner != request.user:
        return HttpResponse("KO")
    gl.cover = img
    gl.save()
    return HttpResponse("OK")

def gallery(request, gid):
    tpl = "polaroid/gallery.html"
    ctxt = dict()
    gal = Gallery.objects.get(id=gid)
    ctxt["gal"] = gal 
    ctxt["imgs"] = gal.image_set.all()
    ctxt["form"] = UploadForm(initial={"gallery": gid})
    return render(request, tpl, ctxt)

@login_required
def remove_img(request, mid):
    img = Image.objects.get(id=mid)
    if img.owner != request.user:
        return HttpResponse("KO")
    img.delete()
    return HttpResponse("OK")

@login_required
def remove_gallery(request, gid):
    gl = Gallery.objects.get(id=gid)
    if gl.owner != request.user:
        return HttpResponse("KO")
    for img in gl.image_set.all():
        img.delete()
    gl.delete()
    return HttpResponse("OK")

@login_required
def upload(request):
    if request.method != "POST":
        # Handle this properly (error message)
        return redirect("index")
    form = UploadForm(request.POST, request.FILES)
    if form.is_valid(request.user):
        form.save(request.FILES["path"], request.user)
        return HttpResponse("OK")
    return HttpResponse("KO")


## User management ##

def register(request):
    """
        Registration of new users
        redirect to index if registration succeed
    """
    ctxt = dict()
    tpl = "registration/register.html"
    # Get registration form from POST values
    reg_form = UserCreationForm(request.POST or None, label_suffix='')
    # Check the form validity
    if reg_form.is_valid():
        # Register the new user
        new_user = reg_form.save()
        # Authenticate
        new_user = authenticate(username=new_user.username, password=request.POST["password1"])
        # Log the new user in
        login(request, new_user)
        return redirect("index")
    else:
        # Else we show a registration form
        ctxt["reg_form"] = reg_form
        return render(request, tpl, ctxt)
