from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Chamado, Status, HistoricoStatus, Resposta


class ChamadoSerializer(serializers.ModelSerializer):
    status_nome = serializers.CharField(source='status.nome', read_only=True)

    usuario_nome = serializers.CharField(source='usuario.username', read_only=True)  #Exibe quem criou o chamado

    class Meta:
        model = Chamado
        fields = [
            'id',
            'titulo',
            'descricao',
            'status',
            'status_nome',
            'usuario',          
            'usuario_nome',  #exibição de quem criou o chamado    
            'criado_por',
            'data_criacao',
            'data_atualizacao',
        ]


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Status
        fields = [
            'id',
            'nome',
        ]


class HistoricoStatusSerializer(serializers.ModelSerializer):
    status_nome = serializers.CharField(source='status.nome', read_only=True)

    class Meta:
        model = HistoricoStatus
        fields = [
            'id',
            'chamado',
            'status',
            'status_nome',
            'data_alteracao',
        ]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "is_staff", "is_superuser"]


class RespostaSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source="usuario.username", read_only=True)

    class Meta:
        model = Resposta
        fields = [
            "id",
            "chamado",
            "mensagem",
            "usuario_nome",
            "criado_em",
        ]