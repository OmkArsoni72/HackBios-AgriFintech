const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function PATCH(request, context) {
  try {
    const { productId } = await context.params;
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/products/${productId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Admin product status update error:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to update product status',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
