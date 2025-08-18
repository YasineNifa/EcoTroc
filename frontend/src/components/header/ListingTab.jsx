import ListListings from "../ListListings";

const ListingsTab = ({ listings }) => {
  return (
    <>
      <h1 className="text-2md font-bold mb-4">{listings.length} articles</h1>
      <ListListings results={listings} />
    </>
  );
};

export default ListingsTab;
