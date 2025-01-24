<style>
    .aboutcv {
        position: fixed;
        width: 60%;
        height: 60%;
        max-height: 60vh;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        margin-top: 50px;
        overflow: scroll;
        padding: 1rem;
    }
</style>

<div class="aboutcv shadow-2xl p-4 shadow-black/80 h-60vh bg-white mt-0 text-slate-800/90 rounded-lg p-4">
    <button type="button" class="text-white btn btn-sm hover:bg-green-700/70 border-0 bg-green-700/60 btn-circle float-right" onclick="hideCVInfo()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
    <h1 class="font-bold text-4xl">About
        <i class="fa fa-question-circle mr-2 text-green-700/60" style="font-size:36px;"></i>
    </h1>
    <div class="flex mt-2 ml-2 flex-col mr-12">
        <div class="text-green-700/80 font-bold text-lg">Bus Stop CV</div>
            <div class="">
                <p>This page displays all bus stops available in Gainesville. </br>
                    After clicking on a stop, you may select to <span class="text-green-700/60">'view BusStopCV'</span> which will redirect you to a separate page
                    where you will interact with a panorama of the associated stop. This page is the product of a project
                intending to use AI features to highlight amenities at bus stops. </br> You may click and drag to orient
                    your position and view the stop and its amenities.
                    </br> If you notice any discrepancies or amenities that have not been labeled, 
                    you may click on an amenity and label it manually.
                    </br>
                    Once you are finished, click on the <span class="text-green-700/60">'return to Dashboard'</span> button to return to this page.
                </p>
            </div>
            <div class="text-green-700/80 font-bold text-lg mt-2">Acknowledgment</div>
            <div class="">
            <p>
                    This project is the product of the MakeAbility Lab at the University of Washington.
                    It was developed with the intention of improving detection of bus stop features.
</br>To learn more about the Bus Stop CV project, you may <a class="font-bold text-green-700/60" href="https://github.com/ProjectSidewalk/BusStopCV" target="_blank">view it on Github.</a>
                </p>
            </div>
            <div class="text-green-700/80 font-bold text-lg mt-5">Citation</div>
            <div class="text-xs">
            <p>
            Minchu Kulkarni, Chu Li, Jaye Ahn, Katrina Ma, Zhihan Zhang, Michael Saugstad, Yochai Eisenberg, Valerie Novack, Brent Chamberlain, Jon E. Froehlich. 2023. BusStopCV: A Real-time AI Assistant for Labeling Bus Stop Accessibility Features in Streetscape Imagery. In The 25th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS ’23), October 22–25, 2023, New York, NY, USA. ACM, New York, NY, USA, 5 pages
                </p>
            </div>
        </div>
    </div>
</div>