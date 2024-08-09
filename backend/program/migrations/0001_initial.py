# Generated by Django 5.0.6 on 2024-07-18 07:44

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Entry',
            fields=[
                ('data', models.JSONField()),
                ('type', models.CharField(choices=[('text', 'text'), ('rank', 'rank'), ('email', 'email'), ('upload', 'upload'), ('prompt', 'prompt')], default='text', max_length=10)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Step',
            fields=[
                ('title', models.CharField(max_length=52)),
                ('display_mode', models.CharField(choices=[('doc', 'doc'), ('slide', 'slide')], default='doc', max_length=5)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Program',
            fields=[
                ('title', models.CharField(max_length=52)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('coach', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='user.coach')),
                ('students', models.ManyToManyField(blank=True, related_name='students', to='user.student')),
            ],
        ),
        migrations.CreateModel(
            name='Response',
            fields=[
                ('data', models.JSONField()),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='program.entry')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.student')),
            ],
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('title', models.CharField(max_length=52)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='program.program')),
                ('action_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='action_plan', to='program.step')),
                ('check_in', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='check_in', to='program.step')),
                ('end', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='end', to='program.step')),
                ('start', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='start', to='program.step')),
            ],
        ),
        migrations.AddField(
            model_name='entry',
            name='step',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='program.step'),
        ),
        migrations.CreateModel(
            name='Submission',
            fields=[
                ('checked_in', models.BooleanField(default=False)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('module', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='program.module')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.student')),
            ],
        ),
    ]
