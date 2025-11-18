const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function DELETE(request, context) {
  try {
    const { productId } = await context.params;
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Admin product delete error:', error);
    return Response.json(
      { 
        success: false, 
        message: 'Failed to delete product',
        error: error.message 
      },
      { status: 500 }
    );
  }
}
