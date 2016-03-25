# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-25 09:15
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0007_image_owner'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='gallery',
            new_name='gl',
        ),
        migrations.AddField(
            model_name='gallery',
            name='cover',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='website.Image'),
        ),
    ]