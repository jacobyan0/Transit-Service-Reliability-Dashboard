<style>
    .about {
        position: fixed;
        width: 70%;
        height: 70%;
        max-height: 70vh;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        margin-top: 30px;
        overflow: scroll;
    }
</style>

<div class="about shadow-2xl pb-4 shadow-black/80 h-70vh bg-white  mt-0 text-slate-800/90 rounded-lg p-4">
    <button type="button" class="text-white btn btn-sm hover:bg-green-700/70 border-0 bg-green-700/60 btn-circle float-right" onclick="closeAbout()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
    <h1 class="font-bold text-4xl">About
    <i class="fa fa-question-circle mr-2 text-green-700/60" style="font-size:36px;"></i>
    </h1>
    <div class="flex mt-2 ml-2 flex-col mr-12">
    <div class="text-green-700/80 font-bold text-lg">Real-Time Info</div>
            <div class="ml-2">
                <p class=" ">This page displays real-time bus data.
                    Users may select to view all buses currently running or view a specific route or set of routes.
                    The page also displays realtime operational status of buses, including the number of buses/vehicles that are currently delayed. 
                </p>
            </div>
            <div class="divider mt-1 mb-1"></div>
            <h2 class="text-green-700/80 font-bold text-lg">Performance Tracking</h2>
            <div class="ml-2">
                <p class="">This page displays bus data visually in the form of charts, graphs, and maps.
                Users must select to view data for today, all-time (data collection began Oct. 18, 2022),
                or choose their own date range.
                </p>
            </div>
            <div class="divider mt-1 mb-1"></div>
            <h2 class="text-green-700/80 font-bold text-lg">Bus Stop Amenities</h2>
            <div class="ml-2">
                <p class="">This page allows users to view bus-stops and the amenities offered at each stop.
                 Users may use the search feature to search for a specific bus name or ID, search by current location 
                to view stops within ~1/2 mile of their current location, and view stops by route.
                </p>
            </div>
            <div class="divider mt-1 mb-1"></div>
            <h2 class="text-green-700/80 font-bold text-lg">User Feedback</h2>
            <div class="ml-2">
                <p class="">This page allows users to leave feedback on the Gainesville bus system.
                </br>  Users may either report an incident or leave general feedback. Feedback may be left on either a bus stop, a route,
                or a general location.
                </p>
            </div>
            <div class="divider mt-1 mb-1"></div>
            <h2 class="text-green-700/80 font-bold text-lg">About</h2>
            <div class="ml-2">
            <p class="">This dashboard was developed by Ksenia Velichko at the Just & Green Transportation Lab under the supervision of Dr. Jacob Yan.
                </p>
            </div>
        </div>
    </div>
</div>