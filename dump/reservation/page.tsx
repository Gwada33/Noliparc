import '@/css/reservation.css'
import Link from 'next/link';
import content  from '../../public/texts.json'

const Reservation: React.FC = () => {
  return (
    <div className="reservation-container">
            <h1 className='reservation-title'>Réservez votre activité</h1>
      <div className="options-container">
        <Link
          className={`option-button`}
          href={`/reservation/noliparc`}
        >
          <img className='image-noliparc' src={content.header['image-noliparc']} alt="" />
        </Link>

        <Link
          className={`option-button`}
          href={`/reservation/nolijump`}
        >
           <img className='image-nolijump' src={content.header['image-nolijump']} alt="" />

        </Link>
      </div>
    </div>
  );
};

export default Reservation;
