from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .auth_views import RegisterView, UserMeView

urlpatterns = [
    path('admin/', admin.site.urls),
    path(
        'api/schema/',
        SpectacularAPIView.as_view(permission_classes=[AllowAny], authentication_classes=[]),
        name='schema'
    ),
    path(
        'api/schema/swagger-ui/',
        SpectacularSwaggerView.as_view(url_name='schema', permission_classes=[AllowAny], authentication_classes=[]),
        name='swagger-ui'
    ),

    # Auth JWT
    path('api/v1/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/v1/auth/me/', UserMeView.as_view(), name='user_me'),
    
    # API endpoints
    path('api/v1/categories/', include('apps.categories.urls')),
    path('api/v1/medicaments/', include('apps.medicaments.urls')),
    path('api/v1/ventes/', include('apps.ventes.urls')),
]