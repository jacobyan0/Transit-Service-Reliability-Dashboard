<style>
    .overlayPage {
        position: fixed;
        width: 55%;
        height: 40%;
        max-height: 40vh;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        margin-top: 10%;
        overflow: scroll;
        padding: 1rem;
    }
</style>

<div class="overlayPage flex flex-col h-full shadow-2xl p-3 font-bold shadow-black/80 h-35vh bg-white mt-0 text-slate-800/90 rounded-lg p-4">
    <h1 class="text-3xl text-slate-800/80 mb-1">Your Feedback Has Been Received</h1>
    <table class="bg-green-600/20 w-11/12 font-semibold text-center rounded-lg p-2">
        <thead>
        <th class=" pl-2">Stop Name</th>
        <th>Stop ID</th>
        <th>Seating</th>
        <th>Trashcans</th>
        <th>Shelters</th>
        <th>Signage</th>
        </thead>
        <tbody class="border-t-2 font-normal border-green-700/50">
        <?php
        $sql = "SELECT cv_census.stop_id, cv_census.id, cv_census.benches, cv_census.trashcans, cv_census.shelters, cv_census.signage, stop_inventory.stop_name FROM `cv_census` inner join stop_inventory on stop_inventory.id = cv_census.stop_id ORDER BY cv_census.id DESC LIMIT 1;";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $userID = $row['id'];
                echo "<tr><td class='pl-2'>".$row['stop_name']."</td><td class='pl-1'>".$row['stop_id']."</td><td class='pl-1'>".$row['benches']."</td><td class='pl-1'>".$row['trashcans']."</td><td class='pl-1'>".$row['shelters']."</td><td class='pl-1'>".$row['signage']."</td></tr>";
            }
        }
        ?>
        </tbody>
    </table>
    <div class="font-normal w-11/12 mt-2">
        Your input on the amenities present at the selected bus stop has been successfully documented and should be displayed in the table above.</br>
        If you encountered any issue with the AI tool, please specify below so we may avoid these issues in the future.
        <select id="status" name="reason" class="rounded-lg px-2 p-1 mt-1 mb-1 bg-green-600/20 w-full">
            <option value="success" selected>There were no issues</option>
            <option value="wrong table">The table above is incorrect</option>
            <option value="unable to locate">I was unable to locate the bus stop</option>
            <option value="malfunction">The panorama malfunctioned</option>
            <option value="mislabeled">I mislabeled the amenities</option>
            <option value="trouble with AI">I had issues with the AI tool</option>
            <option value="other">Other</option>
        </select>
    </div>
    <button type="button" class="px-2 w-1/6 mt-5 font-bold  flex justify-between text-slate-800/80 align-items-center p-2 rounded-lg hover:bg-green-700/40 bg-green-600/40" onclick="processStatus()"> Confirm
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 19L2 12l1.41-1.41L9 16.17l11.59-11.59L22 6l-13 13z"/></svg>
    </button>
</div>

<script>
    function processStatus() {
        var userStatus = document.getElementById('status').value;
        var id = "<?php echo $userID; ?>";

        $.ajax(
            {
            url: "backend/amenities/updateStatus.php",
            type: 'POST',
            dataType: 'text',
            data: {id: id, status: userStatus},
            success: function ()
            {
                console.log("successfully updated user status");
            },          
            error: function ()
            {
                console.log("Error");
            }
        });
        hideConfirmPage();
    }
</script>