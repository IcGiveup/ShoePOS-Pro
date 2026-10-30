export default function CardBox({
  title,
  value
}) {
  return (
    <div className="bg-white shadow rounded-2xl p-5">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}