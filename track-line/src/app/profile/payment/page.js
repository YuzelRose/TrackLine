"use client";
export default function PayMains() {
  const handlePaypalSubmit = (e) => {
    e.preventDefault();
    
    // Crear form dinámicamente
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.sandbox.paypal.com/cgi-bin/webscr';
    
    const params = {
      cmd: '_xclick',
      business: 'sb-ieagm47741589@business.example.com',
      amount: '1500.00',
      currency_code: 'MXN',
      item_name: 'Pago Curso Matematicas',
      return: `${window.location.origin}/payment/success`,
      cancel_return: `${window.location.origin}/payment/cancel`,
      notify_url: `${window.location.origin}/api/paypal/ipn`
    };
    
    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <main>
      <div className='h-screen flex justify-center items-center'>
        <form onSubmit={handlePaypalSubmit}>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center"
          >
            <img 
              src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/pp-acceptance-medium.png" 
              alt="PayPal" 
              className="mr-2"
            />
            Pay with PayPal
          </button>
        </form>
      </div>
    </main>
  );
}