import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__text">No encontramos esta página.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}

export default NotFoundPage;
