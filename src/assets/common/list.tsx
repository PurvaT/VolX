import ListItem from "./list-item";

interface ListProps {
    listItems: React.ReactNode[];
}
const List = (props: ListProps) => {
    const {listItems} = props;
    return <div>
        {listItems.map((item, index) => (
            <ListItem key={index} item={item} index={index} />
        ))}
    </div>;
}
export default List;