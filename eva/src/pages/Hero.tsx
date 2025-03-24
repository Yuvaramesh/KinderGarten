import "./style.css";
import Tooltip from "../components/ui/Tooltip";
import GridBackgroundDemo from "../components/ui/GridBackground";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import Hero_card from "./Hero_card";

const ImageView = () => {
  return (
    <div className={` relative flex-1`}>
      <div className=" relative h-1/2 w-full ">
        <Tooltip
          className={
            " absolute bottom-28 left-48 z-10 h-14 w-40 animate-bounce rounded-e-2xl rounded-tl-2xl     "
          }
        />
        <div className=" ttob  relative left-0  h-full w-60   overflow-hidden rounded-b-full bg-blue-500  ">
          <img className="absolute -bottom-2   " src={`/girl.png`} alt="" />
        </div>
      </div>
      <div className="  -right-10 top-1/2 h-96 w-full -translate-y-1/3 translate-x-[33%]    ">
        -
        <div className=" absolute h-full w-full overflow-hidden">
          <div className="ltor absolute bottom-0 h-1/2 w-full overflow-x-clip overflow-y-visible rounded-full bg-yellow-500"></div>
          <img
            className=" btot absolute -bottom-2  left-0 w-3/4 overflow-hidden bg-cover  transition-all "
            src={`/man.png`}
            alt=""
          />
        </div>
        <Tooltip
          className={
            " absolute -left-16 top-36 h-14 w-40 animate-bounce  rounded-s-2xl rounded-tr-2xl  "
          }
        />
        <Tooltip
          className={
            " absolute left-28 top-64 h-14 w-40 animate-bounce rounded-e-2xl rounded-bl-2xl   "
          }
        />
      </div>
    </div>
  );
};

const Heropage = () => {
  const navigate = useNavigate();
  return (
    <>
      <GridBackgroundDemo>
        <div className="  relative grid h-screen w-full grid-cols-[1.5fr_1fr] grid-rows-1">
          <div className="   ml-32 flex flex-col  justify-center gap-9 px-10 ">
            <div>
              <h2 className={` texteffect  mt-10 text-6xl font-bold uppercase`}>
                EVA
                <img
                  src="/speaker.png"
                  className=" ml-5 inline-block size-16"
                />
                HandWriting
              </h2>
              <p className="  text-xl capitalize leading-10 text-zinc-600">
                <img src="/icon2.png" className=" inline-block size-8" />
                Elevate your language mastery with AI-powered
                <img src="/icon2.png" className=" inline-block size-8" />{" "}
                grammar
                <img src="/icon1.png" className=" inline-block size-8" />
                checks,
                <img src="/icon1.png" className=" inline-block size-8" />{" "}
                multilingual pronunciation, interactive word coaching , and
                dynamic learning tools.
              </p>
            </div>
            <Button
              onClick={() => navigate("/letternotebook")}
              className=" bg-black text-white"
            >
              Get Started
            </Button>
          </div>
          <ImageView />
          {/* <SlantingBox /> */}
        </div>
      </GridBackgroundDemo>
      <GridBackgroundDemo>
        <Hero_card />
      </GridBackgroundDemo>
    </>
  );
};

export default Heropage;
