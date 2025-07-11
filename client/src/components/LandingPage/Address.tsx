import React from "react";

const Address: React.FC = () => {
  return (
    <section id="address" className="p-10 bg-black text-white">
      <h2 className="text-4xl font-bold mb-4 text-center">Our Address</h2>
      <p className="text-center mb-4">
        Jl. Mangga, Utan Kayu Selatan, Matraman, Jakarta Timur, Jakarta 13120
      </p>
      <div className="flex justify-center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4477098372386!2d106.86730971527552!3d-6.204521862507511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f48896ba4e31%3A0xce1f7b0bac0dd734!2sJl.%20Mangga%2C%20Utan%20Kayu%20Sel.%2C%20Kec.%20Matraman%2C%20Kota%20Jakarta%20Timur%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2013120!5e0!3m2!1sen!2sid!4v1677163722368!5m2!1sen!2sid"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          className="w-full md:w-1/2 h-64 md:h-96 rounded-lg"
        ></iframe>
      </div>
    </section>
  );
};

export default Address;
