import './loading.css';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader">
        <div className="box1"></div>
        <div className="box2"></div>
        <div className="box3"></div>
      </div>
    </div>
  );
}
