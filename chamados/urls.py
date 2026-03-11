from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ChamadoViewSet, StatusViewSet, HistoricoStatusViewSet


router = DefaultRouter()
router.register(r'chamados', ChamadoViewSet, basename='chamado')
router.register(r'status', StatusViewSet, basename='status')
router.register(r'historico-status', HistoricoStatusViewSet, basename='historico-status')

urlpatterns = [
    path('', include(router.urls)), 
]

