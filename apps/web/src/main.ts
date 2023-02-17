import "./style.css";

import TrapScenario from "./scenarios/Trap";
import DisabledScenario from "./scenarios/Disabled";
import TrapGroupInList from "./scenarios/TrapGroupInList";
import ListScenario from "./scenarios/List";
import ListGroup from "./scenarios/ListGroup";
import ListInTrapGroup from "./scenarios/ListInTrapGroup";
import ListGroupInList from "./scenarios/ListGroupInList";
import ListGroupInTrapGroup from "./scenarios/ListGroupInTrapGroup";
import NestedTrapGroups from "./scenarios/NestedTrapGroups";

ListGroupInList(document.getElementById("app")!);
