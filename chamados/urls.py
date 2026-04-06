from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ChamadoViewSet, RespostaViewSet, StatusViewSet, HistoricoStatusViewSet


router = DefaultRouter()
router.register(r'chamados', ChamadoViewSet, basename='chamado')
router.register(r'status', StatusViewSet, basename='status')
router.register(r'historico-status', HistoricoStatusViewSet, basename='historico-status')
router.register(r"respostas", RespostaViewSet)

urlpatterns = [
    path('', include(router.urls)), 
]

