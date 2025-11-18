const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function PATCH(request, context) {
  try {
    const { userId } = await context.params;
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Admin user status update error:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to update user status',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
