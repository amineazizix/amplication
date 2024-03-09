import { EnumResourceType } from "@amplication/code-gen-types/models";
import {
  CircleBadge,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  List,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useStiggContext } from "@stigg/react-sdk";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { useAppContext } from "../context/appContext";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import PluginsTile from "./PluginsTile";
import RolesTile from "./RolesTile";
import { ServicesTile } from "./ServicesTile";
import { TopicsTile } from "./TopicsTile";
import ViewCodeViewTile from "./ViewCodeViewTile";
import { BtmButton, EnumButtonLocation } from "./break-the-monolith/BtmButton";
import { resourceThemeMap } from "./constants";
import AppGitStatusPanel from "./git/AppGitStatusPanel";
import { useResourceSummary } from "./hooks/useResourceSummary";
import AddResourceFunctionalityButton from "./AddResourceFunctionalityButton";

const PAGE_TITLE = "Resource Overview";

type usageDataItem = {
  icon: string;
  title: string;
  link: string;
  value: number;
};

const ResourceOverview = () => {
  const { currentResource, currentProject, currentWorkspace } = useAppContext();
  const { refreshData } = useStiggContext();

  const { summaryData, rankedCategories } = useResourceSummary(currentResource);

  const resourceId = currentResource?.id;

  const resourceUsageData = useMemo((): usageDataItem[] => {
    return [
      {
        icon: "database",
        title: "Data Models",
        link: `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/entities`,
        value: summaryData.models,
      },
      {
        icon: "api",
        title: "APIs",
        link: `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/modules/all`,
        value: summaryData.apis,
      },
      {
        icon: "plugin",
        title: "Installed Plugins",
        link: `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/plugins/installed`,
        value: summaryData.installedPlugins,
      },
      {
        icon: "roles_outline",
        title: "Roles",
        link: `/${currentWorkspace.id}/${currentProject.id}/${currentResource.id}/roles`,
        value: summaryData.roles,
      },
    ];
  }, [currentProject.id, currentResource, currentWorkspace, summaryData]);

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <FlexItem>
        <FlexItem.FlexEnd direction={EnumFlexDirection.Row}>
          <BtmButton
            openInFullScreen
            location={EnumButtonLocation.Resource}
            ButtonStyle={EnumButtonStyle.GradientFull}
          />
          <AddResourceFunctionalityButton rankedCategories={rankedCategories} />
        </FlexItem.FlexEnd>
      </FlexItem>

      <HorizontalRule doubleSpacing />

      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <FlexItem.FlexStart direction={EnumFlexDirection.Column}>
            <CircleBadge
              size="large"
              name={currentResource?.name || ""}
              color={
                resourceThemeMap[currentResource?.resourceType].color ||
                "transparent"
              }
            />
            <Text textStyle={EnumTextStyle.H3}>{currentResource?.name}</Text>
            <Text textStyle={EnumTextStyle.Description}>
              {currentResource?.description}
            </Text>
            <AppGitStatusPanel resource={currentResource} />
          </FlexItem.FlexStart>
          <FlexItem.FlexEnd>
            {resourceUsageData.map((item) => (
              <Link to={item.link} key={item.title}>
                <FlexItem
                  direction={EnumFlexDirection.Row}
                  gap={EnumGapSize.Default}
                  itemsAlign={EnumItemsAlign.Center}
                >
                  <Icon
                    color={EnumTextColor.White}
                    icon={item.icon}
                    size={"small"}
                  />
                  <Text
                    textStyle={EnumTextStyle.Tag}
                    textColor={EnumTextColor.White}
                  >
                    {item.title}
                  </Text>
                  {item.value && (
                    <Text
                      textStyle={EnumTextStyle.Tag}
                      textColor={EnumTextColor.ThemeTurquoise}
                    >
                      {item.value}
                    </Text>
                  )}
                </FlexItem>
              </Link>
            ))}
          </FlexItem.FlexEnd>
        </FlexItem>
      </Panel>

      <List>
        {currentResource?.resourceType === EnumResourceType.Service && (
          <>
            <EntitiesTile resourceId={resourceId} />
            <PluginsTile resourceId={resourceId} />

            <RolesTile resourceId={resourceId} />
          </>
        )}
        {currentResource?.resourceType === EnumResourceType.MessageBroker && (
          <>
            <TopicsTile resourceId={resourceId} />

            <ServicesTile resourceId={resourceId} />
          </>
        )}
        <ViewCodeViewTile resourceId={resourceId} />

        <DocsTile />
        <FeatureRequestTile />
      </List>
    </PageContent>
  );
};

export default ResourceOverview;
