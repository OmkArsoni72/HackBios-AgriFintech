const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function DELETE(request, context) {
  try {
    const { userId } = await context.params;
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Admin user delete error:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to delete user',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
