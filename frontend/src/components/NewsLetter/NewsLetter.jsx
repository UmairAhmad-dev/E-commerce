import './Newsletter.css';

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <div className="newsletter">
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Your Email ID" required />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
};

export default Newsletter;