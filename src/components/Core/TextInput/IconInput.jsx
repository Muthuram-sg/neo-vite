export default function IconInput(props) {
  return (
    <div class="">
      <div class="flex absolute inset-y-0 left-0 items-center pl-3">
        <img src={props.icon} alt="icon" className="text-zinc-500" width={20} />
      </div>
      <input
        type="text"
        id="input-group-1"
        className="bg-zinc-900 font-geist-sans text-zinc-400 placeholder-zinc-500 rounded-sm focus:ring-blue-500 focus:border-blue-500 border-0 block pl-10 p-2.5"
        placeholder="Search"
        style={{width: '500px'}}
      />
    </div>
  );
}
