from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .serializers import ChamadoSerializer, HistoricoStatusSerializer, StatusSerializer, UserSerializer, RespostaSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as http_status
from .models import Chamado, Status, HistoricoStatus, Resposta
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from django.contrib.auth.models import User

from chamados import serializers


class ChamadoViewSet(ModelViewSet):
    serializer_class = ChamadoSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Chamado.objects.all()
        
        return Chamado.objects.filter(usuario=user)


    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


    def get_permissions(self):
        if self.action in ['atualizar_status']:
            return [IsAdminUser()]
        
        if self.request.method == 'DELETE':
            return [IsAdminUser()]
        
        return [IsAuthenticated()]


    @action(detail=True, methods=['patch'])
    def atualizar_status(self, request, pk=None):
        chamado = self.get_object()

        status_id = request.data.get('status')

        if not status_id:
            return Response({'error': 'O campo "status" é obrigatório.'}, status=http_status.HTTP_400_BAD_REQUEST)
        
        try:
            status_novo = Status.objects.get(id=status_id)

        except Status.DoesNotExist:
            return Response({'error': 'Status não encontrado.'}, status=http_status.HTTP_404_NOT_FOUND)
        
        
        chamado.status = status_novo
        chamado.save()

        HistoricoStatus.objects.create(chamado=chamado, status=status_novo)

        return Response({'message': 'Status atualizado com sucesso.'}, status=http_status.HTTP_200_OK)  
    

    @action(detail=True, methods=['get'])
    def historico(self, request, pk=None):
        chamado = self.get_object()
        historicos = HistoricoStatus.objects.filter(chamado=chamado).order_by('-data_alteracao')

        serializer = HistoricoStatusSerializer(historicos, many=True)
        return Response(serializer.data, status=http_status.HTTP_200_OK)
    

    
class StatusViewSet(ModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticated]    


class HistoricoStatusViewSet(ModelViewSet):
    queryset = HistoricoStatus.objects.all().order_by('-data_alteracao')
    serializer_class = HistoricoStatusSerializer
    permission_classes = [IsAuthenticated]    
    


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
       

class RespostaViewSet(ModelViewSet):
    queryset = Resposta.objects.all()
    serializer_class = RespostaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Resposta.objects.all()

        chamado_id = self.request.query_params.get('chamado')

        if chamado_id:
            queryset = queryset.filter(chamado_id=chamado_id)

        return queryset.order_by('criado_em')


    def perform_create(self, serializer):
        chamado = serializer.validated_data['chamado']
        serializer.save(usuario=self.request.user)

        # Campo resposta apenas se chamado estiver ATIVO
        if chamado.status.nome != "ATIVO":
            raise serializers.ValidationError("Só é possível responder chamados ATIVOS.")

        serializer.save(usuario=self.request.user)