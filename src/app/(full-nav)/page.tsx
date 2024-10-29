import classes from './page.module.css';
import HeroSection from '@/components/hero-section';

export const dynamic = 'force-static';

export default function Home() {
    return (
        <main>
            <HeroSection />
            <div className={classes.below_fold}>
                <h3 className={classes.alt_text}>Activisor Manages Group Activities</h3>
                <p>Nine players sharing one court for the season? Tired of spending hours managing your gaming or sports group&apos;s schedule? Someone getting the date, time, or place wrong? We know it&apos;s hard to create a schedule that provides a good experience for all and then coordinate attendance - but it doesn&apos;t have to be.
                    Activisor creates Google Sheets schedules for recurring meetings and then manages your group to get the right members to the right place at the right time.
                </p>
                <br></br>
                <h3 className={classes.alt_text}>How It Helps</h3>
                <ul  className={classes.list_items}>
                    <li>
                        <span className={`${classes.alt_text} ${classes.item_title}`}>Effortless Scheduling:</span>Some members seeing certain ones too often and others hardly at all?  Activisor both balances participation and evenly mixes up the lineups across all your dates to ensure a good experience for everyone. In a couple of minutes, Activisor can publish a schedule to your group with any activity costs fairly shared.
                    </li>
                    <li>
                        <span className={`${classes.alt_text} ${classes.item_title}`}>Reduce Attendance Problems:</span>It can be a hassle to keep track of who&apos;s coming and who&apos;s not and then helping them to show up. From chasing down deadbeats to finding substitutions, Activisor will take care of it for you.
                    </li>
                    <li>
                        <span className={`${classes.alt_text} ${classes.item_title}`}>Embedded In Your Daily Routine:</span>Activisor is built on the apps you and your group already use every day so you&apos;ll always be on top of things.
                    </li>
                </ul>
                <br></br>
                <h3 className={classes.alt_text}>How It Works</h3>
                <ol className={classes.list_items}>
                    <li>Enter some basic info about your schedule, such as your roster, when meetings occur, and overall cost (if any). <span className={`${classes.alt_text} ${classes.italic_text}`}>Forward your roster group email to us and we can import their contact info.</span></li>
                    <li>Authorize Google to grant access to Activisor in order for us to create your Google Sheets schedule. <span className={`${classes.alt_text} ${classes.italic_text}`}>We don&apos;t touch anything else.</span></li>
                    <li>Preview your schedule and then pay as little as $1 to start using it. <span className={`${classes.alt_text} ${classes.italic_text}`}>We&apos;re rapidly adding more capabilities!</span></li>
                </ol>
                <br></br>
                <br></br>
                <h3 className={classes.alt_text}>About Us</h3>
                <p>Like you, we at Activisor had grown weary of creating meeting schedules for our groups and teams, and then managing attendance for each meeting. We built Activisor to do this for you. We strive to transform recreational group organization and management into a joyous and stress-free experience.</p>
            </div>
        </main>
    );
}
