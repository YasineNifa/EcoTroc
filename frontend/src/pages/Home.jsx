import SellItemModal from "../components/geminiPowered/SellItemModal";
import RecipeModal from "../components/geminiPowered/RecipeModal";
import Header from "../components/shared/Header";
import ItemCard from "../components/shared/ItemCard";
import NotificationBanner from "../components/shared/NotificationBanner";
import { useEffect, useState } from "react";
import useRequestResource from "../hooks/useRequestResource";

const mockItems = [
  {
    id: 1,
    brand: "Super Mario",
    title: "Figurine Super Mario",
    condition: "Neuf avec étiquette",
    price: 70,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbxOFGkFQ3o2zoCYh0l3OfQ_ki2or7YsDt0potXdOdyd459l7QqajrfjrBaqdtY9s2kHWTyAdrVI9oiUSTl3CxoI1bbQt5Mwtrq7X-hgdYlO7isRJXnY2iVokjBOBCYtoQNwONUJW5xYybx5dFPJbtUNmza6JqEQ88raGsRVG-mbaEH0dHMFLdLYmSzbpwC4yxd-npMZolcAs41SSc1HD4ACFNqI4fo9eQ37cfAZxYqCqG7U6iuFOVCokIuyvy-f14GR27N5Zkc_gN",
    likes: 1,
    category: "Divertissement",
  },
  {
    id: 2,
    brand: "Étagère douche",
    title: "Étagère de douche noire",
    condition: "Neuf sans étiquette",
    price: 100,
    serviceFee: 20,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCGS-jzPx5VP07S2WZJva6sH6PzP9IQEr7_3oFtkDrOinIq4l1tlT_ktHLPNFP0DRDcRG_CgDACwLXC59uF62fDxrrhlYAkMn4rc8noEkn8rWpBaS7RVW1kdD_lQt7MqQUTFXvFx2V35BdFugWZGMYQuTKVcQBxzi1bkaUtyLuEr6VcM-b3iHD2yeyk3XXinWbcEyRlYfUe7Kf8HbeG_WD3WFrJbyxq4I1-Ih2a4i3FhKWhR5xiZFXlAH1qv-9fTPdFi5ww5fjleAx-",
    likes: 13,
    category: "Maison",
  },
  {
    id: 3,
    brand: "Re-couvertes",
    title: "Parure de lit",
    condition: "Neuf sans étiquette",
    price: 80,
    serviceFee: 5,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBExsDRk69IFEAav57f9zoz-Fv5cW8JYWmJyOiHpe18GDLI0jW_tkWy4jg1mLZRJdZs0LvUVDukY2tW6ykcrevUcc5Jz1iOIHpxvuMsmHv00Vj1GqXlcNZWT8-lTAfr1EeLAzu5jbEGR2FjilYIc_bVJ-diOJCAxRH4o6zbu8gyQUbWJ5ykqe952hHaiEqMkCKoLBUjb-KMcJuz6-GIFMIgiZ1NvZXfHg1xxP3sfKzb_cV1dBl_X_xp_vvM04-kVB-yyrRs4whGHGSI",
    likes: 0,
    category: "Maison",
  },
  {
    id: 4,
    brand: "Cadre",
    title: "Photo de Batman",
    condition: "Neuf avec étiquette",
    price: 420,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCWmzL0WjVmLoPumWgISsA7xdvL3QXN_I_1WcNU8p185INOR1-kjyfWz8VjZBNDL9GidyG8HycIaH615jrWy_kKqOIxF3otb-UxYTNv3G7L9RnlGBE9aatbjOwBMraYGLup03sCSwRVqfa1rERD6cS5lzEySgw4XHxZ6jmpRbBcAPnvHnx05I7SB1g4SQGFTU0HTMycjyrBXs4T4vMukdTC1Zpt7spbM1VTAgW7l33VmI7GSdpMpxs5nFeZUqgJ1hYCLEdUhAIgF-U7",
    likes: 10,
    category: "Maison",
  },
  {
    id: 5,
    brand: "Marque Sport",
    title: "Chaussures de sport",
    condition: "Neuf sans étiquette",
    price: 580,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHOliVTWSdGngT9doZMOL3ViDX0wD2_6rKIq8Y0P4qFprIfbR2WstcsnnHrbacqokkrY7MHUsl3b0Jq8WtY8QrRs_B574bz4Z5GFLnPXoZOsPyvzE0oaSOVH4AOa1GR0LVFlolh47Aku3gHk-uEWku6_nNt6hEsvkVpm0zYa6Pw9MsNGBhSQ8SRa6Dt5Bt_hUO3Ahw6E2-Sytf8ZmrVs2-hjoCp7D8QzKWXLvE2GO5XTDmRKHvTNBy2zjKorDaEiZ4kY5tUzzKsMJ2",
    likes: 74,
    category: "Hommes",
  },
  {
    id: 6,
    brand: "Divers",
    title: "Papier cadeau",
    condition: "Bon état",
    price: 150,
    serviceFee: 16,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAOSHqWBr9PQ5l_4BB00NGzm4gNSbFoJ9cMy04z9iAnTSdrzXxyWOy2CfmvdBrpoZxUSdlKPmMAfGZJwI8veOmgU7V4oEEduyyLiXk8T-m6Lv86BQRTi8qV3YIn-jEsc-Plw3ZQgVh_MIvUbBZfWQo_D7LJQMTAwIxYW9Ud77A-egx7Ijruq891stEfpLw1jCriGREHbCSIl-p6tzcWDLQ-qYgEJISv8UdjY68JE3grThGSMW_ngizs2fIF0VotJVkc-EYZKcv0_1YY",
    likes: 1,
    category: "Loisirs et collections",
  },
  {
    id: 7,
    brand: "Carrelage",
    title: "Carreaux de céramique",
    condition: "Neuf sans étiquette",
    price: 100,
    serviceFee: 11,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA902YLxjYOW2_iD3zB7Hi-QOAZrcKjnfOnibfD54Sn6m9iA7erJtQf90c4xA4DE-Ak73nHu9i4GYJk5EQOEF01XXaZRGB-1EjsJ1SAjK0DP05K59oBn7ABkOpMo9Xkbje7sTGSWx1jIn-wqItdwQMk_KftX9FKGDBS4g2BaG8w5Hfrz2umnax3iUyvsPDdnJbt3ZbN3UfChIcPHqDDKxeVdw-u5cbEnPQSLjWF6NVg2cBZt14IuI6jANvilk6vjsHV-0yIj0QDS4wM",
    likes: 4,
    category: "Maison",
  },
  {
    id: 8,
    brand: "Stickers",
    title: "Sticker mural floral",
    condition: "Neuf avec étiquette",
    price: 20,
    serviceFee: 2,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBTDo9kv5cfBU1emd1udXdXCWYrmZsDKQ8e833R0CcuhNByvx2YnnDa2UjFO3ZOVBMahUuTkk36hTVJ7xwcgBrAS1tlBG-ZU5d9MKlHNXnGcdg5sFxkE3PiHH0zSNAAHN_WtKvryYPorigkdFVY_42QAOynv0Be3MMR8Byn5ZoniUfcRyFAaJ6yVDbzepIjTq4VHXK1hkUSxjOfboA3Vh4B2ae1WnCaeAzniosKzLKxVvULtfeUKoLFQa9DQeqJjZHILSeu75leBJh",
    likes: 0,
    category: "Maison",
  },
];

const Home = () => {
  const [isSellModalOpen, setSellModalOpen] = useState(false);
  const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
  const [selectedItemTitle, setSelectedItemTitle] = useState("");
  const {getResourceList, resourceList} = useRequestResource({
    endpoint: "listings",
    resourceLabel: "Listing",
  })

  const handleGetRecipe = (itemTitle) => {
    setSelectedItemTitle(itemTitle);
    setRecipeModalOpen(true);
  };

  useEffect(() => {
    getResourceList()
  }, [getResourceList])

  return (
    <div className="bg-gray-50">
      <Header onSellClick={() => setSellModalOpen(true)} />
      <main className="container mx-auto px-4 py-8">
        <NotificationBanner />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {resourceList.results.map((item) => (
            <ItemCard key={item.id} item={item} onGetRecipe={handleGetRecipe} />
          ))}
        </div>
      </main>
      <SellItemModal
        isOpen={isSellModalOpen}
        onClose={() => setSellModalOpen(false)}
      />
      <RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setRecipeModalOpen(false)}
        itemTitle={selectedItemTitle}
      />
    </div>
  );
};

export default Home;
