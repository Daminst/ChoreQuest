export function AvatarCategoryRail({ categories, activeCategory, onSelect }) {
  return (
    <nav className="avatar-category-rail" aria-label="Avatar categories">
      {categories.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" className="avatar-category-button" aria-current={activeCategory === id ? 'page' : undefined} aria-label={label} title={label} onClick={() => onSelect(id)}>
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
