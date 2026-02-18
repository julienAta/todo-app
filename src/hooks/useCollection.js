import { useState, useEffect, useCallback } from "react";
import db from "../lib/db";

export function useCollection(name) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const col = db.collection(name);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await col.getAll();
    setItems(data);
    setLoading(false);
  }, [col]);

  useEffect(() => {
    refresh();
    const unsub = col.subscribe(() => refresh());
    return unsub;
  }, [col, refresh]);

  const create = useCallback(async (data) => {
    const item = await col.create(data);
    return item;
  }, [col]);

  const update = useCallback(async (id, data) => {
    const item = await col.update(id, data);
    return item;
  }, [col]);

  const remove = useCallback(async (id) => {
    return col.delete(id);
  }, [col]);

  const clear = useCallback(async () => {
    return col.clear();
  }, [col]);

  return {
    items,
    loading,
    create,
    update,
    remove,
    clear,
    count: items.length,
    refresh,
    getById: (id) => col.getById(id),
    find: (fn) => items.filter(fn),
  };
}
