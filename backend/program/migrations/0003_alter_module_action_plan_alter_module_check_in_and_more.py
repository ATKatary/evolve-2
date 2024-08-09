# Generated by Django 5.0.6 on 2024-07-18 08:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('program', '0002_alter_entry_data_alter_response_data'),
    ]

    operations = [
        migrations.AlterField(
            model_name='module',
            name='action_plan',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='action_plan', to='program.step'),
        ),
        migrations.AlterField(
            model_name='module',
            name='check_in',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='check_in', to='program.step'),
        ),
        migrations.AlterField(
            model_name='module',
            name='end',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='end', to='program.step'),
        ),
        migrations.AlterField(
            model_name='module',
            name='start',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='start', to='program.step'),
        ),
    ]
