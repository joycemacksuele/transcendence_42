import { Outlet } from "react-router-dom";

const Center = () => {

  return (
    <>
    {/* <div id='div-center'> */}

        <Outlet />
        {/* OUTLET: Inside this component (Center) there is outlet - access to other components (MainComponent, game ...)
                    They are specified as 'Routes' in the top App component.
                    Now they can be displayed within the Center component via the 'Outlet'. */}
    {/* </div> */}
    </>
  );
};

export default Center;
