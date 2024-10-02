//import "./styles.css";
import { requestUsers, User } from "./api";
import { useEffect, useState } from "react";
import { useDebounce } from "./utils";

// interface User {
//   name: string;
//   id: number;
//   age: number;
// }

// interface Query {
//   name: string;
//   age: string;
//   limit: number;
//   offset: number;
// }

// Дана функция requestUsers с аргументом типа Query, которая возвращает
// Promise<User[]>

// Написать приложение по получению пользователей
// - показывать лоадер при загрузке пользователей
// - добавить фильтрацию по имени
// - добавить фильтрацию по возрасту
// - добавить пагинацию

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [ageFilter, setAgeFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(4);

  const debouncedName = useDebounce<string>(nameFilter, 600);
  const debouncedAge = useDebounce<string>(ageFilter, 600);

  useEffect(() => {
    const request = async () => {
      setLoading(true);
      try {
        const fetchedUsers = await requestUsers({
          name: debouncedName,
          age: debouncedAge,
          limit,
          offset: (page - 1) * limit,
        });
        setUsers(fetchedUsers);
      } catch (e) {
        alert((e as { message: string }).message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    request();
  }, [debouncedName, debouncedAge, page, limit]);


  return (
    <div>
      <input
        placeholder="Name"
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />
      <input
        style={{ marginLeft: "8px" }}
        placeholder="Age"
        type="number"
        value={ageFilter}
        onChange={(e) => setAgeFilter(e.target.value)}
      />
      {loading && <div>Loading...</div>}
      {!loading && users.map((user, index) => (
        <div key={user.id} style={{ marginTop: index === 0 ? "16px" : "4px" }}>
          {user.name}, {user.age}
        </div>
      ))}

      <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
        <div>
          <span>By page:</span>
          <select
            style={{ marginLeft: "4px" }}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
        </div>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          prev
        </button>
        <span>page: {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)}>next</button>
      </div>
    </div>
  );
}
