import Icon from "../ui/Icon";
import Token from "../ui/Token";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const ItemCard = ({ item, onGetRecipe }) => (
  <div className="bg-white rounded-lg overflow-hidden group shadow-sm hover:shadow-lg transition-shadow duration-300">
    <div className="relative">
      <img
        alt={item.title}
        className="w-full h-72 object-cover cursor-pointer"
        src={item.image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/300x400/cccccc/4A5568?text=Image+Indisponible";
        }}
      />
      {item.number_of_likes !== undefined && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Icon className="text-sm">
            <FavoriteBorderIcon />
          </Icon>{" "}
          {item.number_of_likes}
        </div>
      )}
    </div>
    <div className="p-3">
      <h1 className="text-lg font-semibold mb-1">{item.title}</h1>
      <p className="text-xs text-gray-500">{item.brand}</p>
      <p className="text-sm text-gray-800">{item.condition}</p>
      <p className="font-bold text-lg text-teal-600 flex items-center">
        {item.token_value} <Token />
      </p>
      {item.category === "Maison" && (
        <button
          onClick={() => onGetRecipe(item.title)}
          className="text-xs text-teal-600 font-semibold mt-2 hover:underline"
        >
          ✨ Obtenir une idée recette
        </button>
      )}
    </div>
  </div>
);

export default ItemCard;
