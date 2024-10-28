# Variables de entorno

EXPRESS_HOST= localhost
EXPRESS_PORT=5011

MONGO_URI="mongodb://root:campus2023@localhost:27017"
MONGO_DB="NotasApp"

# API de Notas y Usuarios

## Base URL
`https://localhost:5011`

## Usuarios

### Crear Usuario
**Método**: `POST`
**URL**: `https://localhost:5011/users`
**Cuerpo de la solicitud**:
```json
{
  "name": "Miguel Angel Castro Escamilla",
  "nickName": "Marcos",
  "password": "123",
  "email": "ma@gmail.com"
}
```
**Autenticación requerida**: `False`

**Respuesta exitosa**
**Código**: `201 Created`
```json
{
  "status": 201,
  "message": "Account created",
  "data": {
    "_id": "6716c1b762f9cc85af494515",
    "name": "Miguel Angel Castro Escamilla",
    "nickName": "Marcos",
    "email": "ma@gmail.com"
  }
}
```

**Respuestas de error**
**Código**: `400 Bad Request`
```json
{
  "status": 400,
  "message": "The nickname is not available.",
  "data": undefined
}
```

### Iniciar Sesión
**Método**: `POST`
**URL**: `https://localhost:5011/users/login`
**Cuerpo de la solicitud**:
```json
{
  "email": "ma@gmail.com",
  "password": "123"
}
```
**Autenticación requerida**: `False`

**Respuesta exitosa**
**Código**: `200 OK`
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6716c1b762f9cc85af494515",
      "name": "Miguel Angel Castro Escamilla",
      "email": "ma@gmail.com"
    }
  }
}
```

### Cerrar Sesión
**Método**: `POST`
**URL**: `https://localhost:5011/users/logout`
**Autenticación requerida**: `True`
**Headers**: 
```
Authorization: Bearer {token}
```

**Respuesta exitosa**
**Código**: `200 OK`
```json
{
  "status": 200,
  "message": "Logout successful",
  "data": null
}
```

## Notas

### Crear Nota
**Método**: `POST`
**URL**: `https://localhost:5011/notes`
**Autenticación requerida**: `True`
**Headers**: 
```
Authorization: Bearer {token}
```
**Cuerpo de la solicitud**:
```json
{
  "title": "Patrones de diseño móvil",
  "description": "Investigación sobre patrones de diseño en aplicaciones móviles moderna",
  "status": "not visible"
}
```

**Respuesta exitosa**
**Código**: `201 Created`
```json
{
  "status": 201,
  "message": "Note created successfully",
  "data": {
    "_id": "6718e1584aa9a9e82f7b1f9f",
    "title": "Patrones de diseño móvil",
    "description": "Investigación sobre patrones de diseño en aplicaciones móviles moderna",
    "userId": "6716c1b762f9cc85af494515",
    "changes": [],
    "status": "not visible"
  }
}
```

### Obtener Todas las Notas
**Método**: `GET`
**URL**: `https://localhost:5011/notes`
**Autenticación requerida**: `True`
**Headers**: 
```
Authorization: Bearer {token}
```

**Respuesta exitosa**
**Código**: `200 OK`
```json
{
  "status": 200,
  "message": "Notes retrieved successfully",
  "data": [
    {
      "_id": "6718e1584aa9a9e82f7b1f9f",
      "title": "Patrones de diseño móvil",
      "description": "Investigación sobre patrones de diseño en aplicaciones móviles moderna",
      "userId": "6716c1b762f9cc85af494515",
      "changes": [],
      "status": "not visible"
    }
  ]
}
```

### Obtener Nota Específica
**Método**: `GET`
**URL**: `https://localhost:5011/notes/{id}`
**Autenticación requerida**: `True`
**Headers**: 
```
Authorization: Bearer {token}
```

**Respuesta exitosa**
**Código**: `200 OK`
```json
{
  "status": 200,
  "message": "Note retrieved successfully",
  "data": {
    "_id": "6718e1584aa9a9e82f7b1f9f",
    "title": "Patrones de diseño móvil",
    "description": "Investigación sobre patrones de diseño en aplicaciones móviles moderna",
    "userId": "6716c1b762f9cc85af494515",
    "changes": [],
    "status": "not visible"
  }
}
```

### Actualizar Nota
**Método**: `PUT`
**URL**: `https://localhost:5011/notes/{id}`
**Autenticación requerida**: `True`
**Headers**: 
```
Authorization: Bearer {token}
```
**Cuerpo de la solicitud**:
```json
{
  "title": "Patrones de diseño móvil actualizado",
  "description": "Nueva descripción actualizada",
  "status": "visible"
}
```

**Respuesta exitosa**
**Código**: `200 OK`
```json
{
  "status": 200,
  "message": "Note updated successfully",
  "data": {
    "_id": "6718e1584aa9a9e82f7b1f9f",
    "title": "Patrones de diseño móvil actualizado",
    "description": "Nueva descripción actualizada",
    "userId": "6716c1b762f9cc85af494515",
    "changes": [3],
    "status": "visible"
  }
}
```

### Eliminar Nota
**Método**: `DELETE`
**URL**: `https://localhost:5011/notes/{id}`
**Autenticación requerida**: `True`
**Headers**: 
```
Authorization: Bearer {token}
```

**Respuesta exitosa**
**Código**: `200 OK`
```json
{
  "status": 200,
  "message": "Note deleted successfully",
  "data": {
    "_id": "6718e1584aa9a9e82f7b1f9f"
  }
}
```

### Buscar Notas
**Método**: `GET`
**URL**: `https://localhost:5011/notes/search`
**Autenticación requerida**: `True`
**Headers**: 
```
Authorization: Bearer {token}
```
**Parámetros de consulta**:
- `searchTerm`: Término de búsqueda (requerido)

**Respuesta exitosa**
**Código**: `200 OK`
```json
{
  "status": 200,
  "message": "Notes found successfully",
  "data": [
    {
      "_id": "6718e1584aa9a9e82f7b1f9f",
      "title": "Patrones de diseño móvil",
      "description": "Investigación sobre patrones de diseño en aplicaciones móviles moderna",
      "userId": "6716c1b762f9cc85af494515",
      "changes": [],
      "status": "not visible"
    }
  ]
}
```

**Respuestas de error comunes para todos los endpoints**

**Código**: `401 Unauthorized`
```json
{
  "status": 401,
  "message": "Authentication required",
  "data": null
}
```

**Código**: `403 Forbidden`
```json
{
  "status": 403,
  "message": "Insufficient permissions",
  "data": null
}
```

**Código**: `404 Not Found`
```json
{
  "status": 404,
  "message": "Resource not found",
  "data": null
}
```

**Código**: `500 Internal Server Error`
```json
{
  "status": 500,
  "message": "Internal server error",
  "data": null
}
```